'use client';

import React from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid'; // 延續您環境中支援 size 屬性的 Grid
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Divider,
  Stack,
  Button,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';

const years = Array.from({ length: 80 }, (_, i) => 1945 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const genders = [
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
  { label: '其他', value: 'other' },
];

export default function JoinPage() {
  // 樣式修正：框線設為白色
  const fieldSx = {
    '& .MuiInputBase-input': { color: '#f5f5f5', py: 1 },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' }, // 白色框線
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
    '& .MuiSvgIcon-root': { color: '#ffffff' }, // 下拉箭頭也設為白色
  };

  // 標籤樣式：靠右對齊並緊貼
  const labelSx = { 
    color: '#ffffff', 
    fontWeight: 500, 
    textAlign: 'right', 
    whiteSpace: 'nowrap'
  };

  const [gender, setGender] = React.useState(genders[0].value);
  const [year, setYear] = React.useState(`${years[0]}`);
  const [month, setMonth] = React.useState(`${months[0]}`);
  const [day, setDay] = React.useState(`${days[0]}`);

  const handleSelectChange = (setter: (v: string) => void) => (e: SelectChangeEvent<string>) => {
    setter(e.target.value as string);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#534963', py: 6 }}>
      <Box display="flex" justifyContent="center" px={2}>
        <Card sx={{ width: '100%', maxWidth: 1000, borderRadius: 3, bgcolor: '#0b1a33', boxShadow: '0 10px 40px rgba(0,0,0,0.32)' }}>
          <CardHeader
            title={<Typography variant="h5" fontWeight={700} sx={{ color: '#ffffff' }}>報名</Typography>}
            sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
          />

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} justifyContent="center">
              
              {/* 姓名行 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={4}>
                    <Typography sx={labelSx}>姓名：</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField hiddenLabel size="small" sx={{ ...fieldSx, width: 200 }} />
                  </Grid>
                </Grid>
              </Grid>

              {/* 性別行 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={4}>
                    <Typography sx={labelSx}>性別：</Typography>
                  </Grid>
                  <Grid size={8}>
                    <Select size="small" value={gender} onChange={handleSelectChange(setGender)} sx={{ ...fieldSx, width: 120 }}>
                      {genders.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>

              {/* 出生年月日行 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={4}>
                    <Typography sx={labelSx}>出生日期：</Typography>
                  </Grid>
                  <Grid size={8}>
                    <Stack direction="row" spacing={1}>
                      <Select size="small" value={year} onChange={handleSelectChange(setYear)} sx={{ ...fieldSx, width: 90 }}>
                        {years.map((y) => <MenuItem key={y} value={`${y}`}>{y}</MenuItem>)}
                      </Select>
                      <Select size="small" value={month} onChange={handleSelectChange(setMonth)} sx={{ ...fieldSx, width: 70 }}>
                        {months.map((m) => <MenuItem key={m} value={`${m}`}>{m}</MenuItem>)}
                      </Select>
                      <Select size="small" value={day} onChange={handleSelectChange(setDay)} sx={{ ...fieldSx, width: 70 }}>
                        {days.map((d) => <MenuItem key={d} value={`${d}`}>{d}</MenuItem>)}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* 證號行 */}
              <Grid size={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={{ xs: 4, md: 2 }}>
                    <Typography sx={labelSx}>身分證字號：</Typography>
                  </Grid>
                  <Grid size={{ xs: 8, md: 10 }}>
                    <TextField hiddenLabel size="small" sx={{ ...fieldSx, width: 250 }} />
                  </Grid>
                </Grid>
              </Grid>

              {/* 電話行 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={4}>
                    <Typography sx={labelSx}>行動電話：</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField hiddenLabel size="small" sx={{ ...fieldSx, width: 200 }} />
                  </Grid>
                </Grid>
              </Grid>

              {/* 信箱行 */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid size={4}>
                    <Typography sx={labelSx}>電子郵件：</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField hiddenLabel size="small" sx={{ ...fieldSx, width: 250 }} />
                  </Grid>
                </Grid>
              </Grid>

              {/* 地址行 */}
              <Grid size={12}>
                <Grid container alignItems="flex-start" spacing={1}>
                  <Grid size={{ xs: 4, md: 2 }}>
                    <Typography sx={{ ...labelSx, mt: 1 }}>通訊地址：</Typography>
                  </Grid>
                  <Grid size={{ xs: 8, md: 10 }}>
                    <TextField fullWidth hiddenLabel size="small" multiline minRows={1} sx={{ ...fieldSx, maxWidth: 650 }} />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </CardContent>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <CardActions sx={{ justifyContent: 'center', py: 4, gap: 3 }}>
            <Button component={Link} href="/" sx={{ color: '#ffffff', textTransform: 'none', opacity: 0.8, '&:hover': { opacity: 1 } }}>返回首頁</Button>
            <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#0b1a33', px: 4, fontWeight: 700, '&:hover': { bgcolor: '#f5f5f5' }, textTransform: 'none' }}>
              報名
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}